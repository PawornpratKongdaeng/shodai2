package config

import (
	"fmt"
	"log"

	//"os"

	"github.com/shodaishop/shodaishop/internal/models"
	//"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := "host=127.0.0.1 user=admin password=password123 dbname=my_store port=5434 sslmode=disable"
	fmt.Println("🚀 กำลังพยายามเชื่อมไปที่:", dsn) // ปริ้นต์ออกมาดูเพื่อความชัวร์

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ เชื่อมไม่ติดเพราะ:", err)
	}

	err = database.AutoMigrate(&models.Category{}, &models.Product{}, &models.User{}, &models.Banner{})
	if err != nil {
		log.Fatal("❌ Migration พัง:", err)
	}

	DB = database
	fmt.Println("✅ ยืนยัน! เชื่อมต่อและสร้างตารางบน Supabase เรียบร้อย")
}
