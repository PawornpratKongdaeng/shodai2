package config

import (
	"fmt"
	"log"
	"os" // ต้องนำเข้า os เพื่อใช้ os.Getenv

	"github.com/shodaishop/shodaishop/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	// ดึงค่าจาก Environment Variables ที่เราจะไปตั้งใน Render
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")
	sslmode := os.Getenv("DB_SSLMODE")

	// กรณีรันในเครื่องตัวเองแล้วไม่มีการตั้งค่า Env ให้ใช้ค่า Default (Optional)
	if host == "" {
		host = "127.0.0.1"
		user = "admin"
		password = "password123"
		dbname = "my_store"
		port = "5434"
		sslmode = "disable"
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		host, user, password, dbname, port, sslmode)

	fmt.Println("🚀 กำลังพยายามเชื่อมไปที่ Database บน Cloud...")

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ เชื่อมไม่ติดเพราะ:", err)
	}

	err = database.AutoMigrate(&models.Category{}, &models.Product{}, &models.User{}, &models.Banner{})
	if err != nil {
		log.Fatal("❌ Migration พัง:", err)
	}

	DB = database
	fmt.Println("✅ เชื่อมต่อฐานข้อมูลสำเร็จ!")
}
