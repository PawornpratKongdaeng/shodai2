package handlers

import (
	"fmt"
	"net/url"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/shodaishop/shodaishop/internal/config"
	"github.com/shodaishop/shodaishop/internal/models"
	"github.com/shodaishop/shodaishop/internal/repository"
)

type ProductHandler struct {
	repo repository.ProductRepository
}

func NewProductHandler(repo repository.ProductRepository) *ProductHandler {
	return &ProductHandler{repo}
}

func (h *ProductHandler) GetProducts(c *fiber.Ctx) error {
	products, err := h.repo.GetAllProducts()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Cannot fetch products"})
	}
	return c.JSON(products)
}

func (h *ProductHandler) GetProductBySlug(c *fiber.Ctx) error {
	rawSlug := c.Params("slug")

	// 1. ถอดรหัสรอบแรก (จะเหลือ %E0...)
	decodedSlug, _ := url.QueryUnescape(rawSlug)

	// 2. ถ้ายังมีเครื่องหมาย % อยู่ แสดงว่าโดน Encode ซ้อนมา ให้ถอดอีกรอบ
	if strings.Contains(decodedSlug, "%") {
		decodedSlug, _ = url.QueryUnescape(decodedSlug)
	}

	fmt.Println("🚀 [1] รับค่ามาคือ:", rawSlug)
	fmt.Println("✅ [2] ถอดรหัสจนเป็นไทยได้คำว่า:", decodedSlug)

	product, err := h.repo.GetProductBySlug(decodedSlug)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "ไม่พบสินค้า"})
	}

	return c.JSON(product)
}
func (h *ProductHandler) SearchProducts(c *fiber.Ctx) error {
	// รับค่าคำค้นหาจาก URL (เช่น ?q=test)
	query := c.Query("q")

	// ถ้าไม่มีคำค้นหาส่งมา ให้คืนค่าเป็น Array ว่างๆ กลับไป (กัน Error)
	if query == "" {
		return c.JSON([]models.Product{})
	}

	// ส่งคำค้นหาไปให้ Repository จัดการต่อ
	products, err := h.repo.SearchProducts(query)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to search products"})
	}

	// คืนค่าข้อมูลสินค้าที่ค้นหาเจอ (ถ้าไม่เจอจะเป็น []) ฝั่ง Next.js จะนำไปแสดงผลได้ถูกต้อง
	return c.JSON(products)
}
func (h *ProductHandler) CreateProduct(c *fiber.Ctx) error {
	product := new(models.Product)
	if err := c.BodyParser(product); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	// --- 2. เพิ่ม Logic ดักจับ: ถ้าไม่มี Slug ให้สร้างจากชื่อสินค้าอัตโนมัติ ---
	if product.Slug == "" {
		// แปลงชื่อเป็นตัวเล็ก ตัดช่องว่างหน้าหลัง และเปลี่ยนช่องว่างตรงกลางให้เป็นขีด (-)
		baseSlug := strings.ToLower(strings.TrimSpace(product.Name))
		product.Slug = strings.ReplaceAll(baseSlug, " ", "-")
	}
	// -------------------------------------------------------------

	if err := h.repo.CreateProduct(product); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not create product"})
	}
	return c.JSON(product)
}

// Update Product
func (h *ProductHandler) UpdateProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	product := new(models.Product)
	if err := c.BodyParser(product); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	// Logic การอัปเดตใน Repository (ตัวอย่างรวบรัด)
	if err := config.DB.Model(&models.Product{}).Where("id = ?", id).Updates(product).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Update failed"})
	}
	return c.JSON(fiber.Map{"message": "Product updated successfully"})
}

// Delete Product
func (h *ProductHandler) DeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := config.DB.Delete(&models.Product{}, id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Delete failed"})
	}
	return c.JSON(fiber.Map{"message": "Product deleted"})
}
