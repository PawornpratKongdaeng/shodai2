package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/shodaishop/shodaishop/internal/config"
	"github.com/shodaishop/shodaishop/internal/handlers"
	"github.com/shodaishop/shodaishop/internal/middleware"
	"github.com/shodaishop/shodaishop/internal/models"
	"github.com/shodaishop/shodaishop/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	config.ConnectDatabase()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	var userCount int64
	config.DB.Model(&models.User{}).Count(&userCount)
	if userCount == 0 {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
		admin := models.User{
			Username: "admin",
			Password: string(hashedPassword),
		}
		config.DB.Create(&admin)
		fmt.Println("✅ สร้างบัญชี Admin สำเร็จ! (User: admin / Pass: password123)")
	}

	var categoryCount int64
	config.DB.Model(&models.Category{}).Count(&categoryCount)
	if categoryCount == 0 {
		// สมมติว่าโครงสร้าง models.Category ของคุณมี Name กับ Slug
		config.DB.Create(&models.Category{
			Name: "หมวดหมู่ทั่วไป",
			Slug: "general",
		})
		fmt.Println("Seeded default category (ID: 1)")
	}

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))
	app.Static("/uploads", "./uploads")

	productRepo := repository.NewProductRepository(config.DB)
	productHandler := handlers.NewProductHandler(productRepo)

	bannerRepo := repository.NewBannerRepository(config.DB)
	bannerHandler := handlers.NewBannerHandler(bannerRepo)

	categoryRepo := repository.NewCategoryRepository(config.DB)
	categoryHandler := handlers.NewCategoryHandler(categoryRepo)

	api := app.Group("/api")

	// Public Routes (ลูกค้าดูได้)
	api.Post("/login", handlers.Login)
	api.Get("/products", productHandler.GetProducts)
	api.Get("/products/search", productHandler.SearchProducts)
	api.Get("/products/:slug", productHandler.GetProductBySlug)
	api.Get("/banners", bannerHandler.GetBanners)
	api.Get("/categories", categoryHandler.GetCategories)

	// Admin Routes (ต้องมี Token เท่านั้น)
	admin := api.Group("/admin", middleware.Protected())
	admin.Post("/products", productHandler.CreateProduct)
	admin.Put("/products/:id", productHandler.UpdateProduct)
	admin.Delete("/products/:id", productHandler.DeleteProduct)
	admin.Post("/upload", handlers.UploadImage)
	admin.Post("/banners", bannerHandler.CreateBanner)
	admin.Delete("/banners/:id", bannerHandler.DeleteBanner)
	admin.Post("/categories", categoryHandler.CreateCategory)
	admin.Put("/categories/:id", categoryHandler.EditCategory)
	admin.Delete("/categories/:id", categoryHandler.DeleteCategory)
	fmt.Printf("🚀 Server is running on port %s\n", port)
	log.Fatal(app.Listen(":" + port))
}
