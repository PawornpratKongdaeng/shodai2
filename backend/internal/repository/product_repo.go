package repository

import (
	"github.com/shodaishop/shodaishop/internal/models"
	"gorm.io/gorm"
)

type ProductRepository interface {
	GetAllProducts() ([]models.Product, error)
	GetProductBySlug(slug string) (models.Product, error)
	CreateProduct(product *models.Product) error
	SearchProducts(query string) ([]models.Product, error)
}

type productRepo struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepo{db}
}

// ✨ แก้ไข (r *productRepository) เป็น (r *productRepo)
func (r *productRepo) SearchProducts(query string) ([]models.Product, error) {
	var products []models.Product

	// ใช้ LIKE ควบคู่กับ % เพื่อให้ค้นหาคำที่มีส่วนประกอบตรงกันได้
	// ใช้ LOWER() เพื่อทำให้การค้นหาไม่สนใจตัวพิมพ์เล็ก-ใหญ่ (Case-Insensitive)
	err := r.db.Where("LOWER(name) LIKE LOWER(?)", "%"+query+"%").Find(&products).Error

	return products, err
}

func (r *productRepo) GetAllProducts() ([]models.Product, error) {
	var products []models.Product
	err := r.db.Where("is_active = ?", true).Find(&products).Error
	return products, err
}

func (r *productRepo) GetProductBySlug(slug string) (models.Product, error) {
	var product models.Product
	err := r.db.Where("slug = ?", slug).First(&product).Error
	return product, err
}

func (r *productRepo) CreateProduct(product *models.Product) error {
	return r.db.Create(product).Error
}
