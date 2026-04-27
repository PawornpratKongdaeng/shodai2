package repository

import (
	"github.com/shodaishop/shodaishop/internal/models"
	"gorm.io/gorm"
)

type BannerRepository interface {
	GetAllBanners() ([]models.Banner, error)
	CreateBanner(banner *models.Banner) error
	DeleteBanner(id string) error
}

type bannerRepo struct {
	db *gorm.DB
}

func NewBannerRepository(db *gorm.DB) BannerRepository {
	return &bannerRepo{db}
}

func (r *bannerRepo) GetAllBanners() ([]models.Banner, error) {
	var banners []models.Banner
	// ดึงแบนเนอร์ทั้งหมดเรียงจากใหม่ไปเก่า
	err := r.db.Order("created_at desc").Find(&banners).Error
	return banners, err
}

func (r *bannerRepo) CreateBanner(banner *models.Banner) error {
	return r.db.Create(banner).Error
}

func (r *bannerRepo) DeleteBanner(id string) error {
	return r.db.Delete(&models.Banner{}, id).Error
}
