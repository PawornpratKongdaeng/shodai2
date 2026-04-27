package models

import (
	"time"

	"gorm.io/gorm"
)

// Category หมวดหมู่สินค้า
type Category struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"not null" json:"name"`
	Slug      string         `gorm:"unique;not null" json:"slug"`
	Icon      string         `json:"icon"`  // ✨ เพิ่มฟิลด์นี้เข้าไป เพื่อเก็บชื่อ Icon (เช่น "Car", "Wrench")
	Image     string         `json:"image"` // (ถ้าไม่ได้ใช้รูปภาพประกอบหมวดหมู่แล้ว จะลบออกก็ได้ครับ หรือเก็บไว้ใช้ร่วมกันก็ได้)
	Products  []Product      `json:"products"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// Product รายละเอียดสินค้า
type Product struct {
	ID               uint           `gorm:"primaryKey" json:"id"`
	CategoryID       uint           `json:"category_id"`
	Name             string         `gorm:"not null" json:"name"`
	Slug             string         `gorm:"unique;not null" json:"slug"`
	Description      string         `json:"description"`
	Price            float64        `gorm:"type:decimal(10,2)" json:"price"`
	ImageURL         string         `json:"image_url"`
	Brand            string         `json:"brand"`             // ยี่ห้อ
	ProductType      string         `json:"product_type"`      // ประเภทสินค้า
	CompatibleModels string         `json:"compatible_models"` // รุ่นรถที่รองรับ
	Features         string         `gorm:"type:text" json:"features"`
	IsActive         bool           `gorm:"default:true" json:"is_active"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
}

type Banner struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `json:"title"`
	ImageURL  string    `gorm:"not null" json:"image_url"`
	Link      string    `json:"link"`
	IsActive  bool      `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}
