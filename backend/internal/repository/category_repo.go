package repository

import (
	"github.com/shodaishop/shodaishop/internal/models"
	"gorm.io/gorm"
)

type CategoryRepository interface {
	GetAllCategories() ([]models.Category, error)
	CreateCategory(category *models.Category) error
	EditCategory(category *models.Category) error
	DeleteCategory(id string) error
}

type categoryRepo struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) CategoryRepository {
	return &categoryRepo{db}
}

func (r *categoryRepo) GetAllCategories() ([]models.Category, error) {
	var categories []models.Category
	err := r.db.Find(&categories).Error
	return categories, err
}

func (r *categoryRepo) CreateCategory(category *models.Category) error {
	return r.db.Create(category).Error
}

func (r *categoryRepo) EditCategory(category *models.Category) error {
	return r.db.Save(category).Error
}

func (r *categoryRepo) DeleteCategory(id string) error {
	// ✨ เติม .Unscoped() เข้าไปก่อน .Delete() เพื่อสั่งลบข้อมูลออกแบบถาวร (Hard Delete)
	return r.db.Unscoped().Delete(&models.Category{}, id).Error
}
