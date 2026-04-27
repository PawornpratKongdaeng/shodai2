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
	// 1. ลองปิดการโหลด env ไว้ก่อนชั่วคราว
	// godotenv.Load()
	// dsn := os.Getenv("DATABASE_URL")

	// 2. แปะค่าจาก Supabase ลงไปตรงๆ (ตัวอย่าง)
	// อย่าลืมเปลี่ยนเป็นพอร์ต 5432 และใส่รหัสผ่านของคุณ
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
