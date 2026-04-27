package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/shodaishop/shodaishop/internal/models"
	"github.com/shodaishop/shodaishop/internal/repository"
)

type BannerHandler struct {
	repo repository.BannerRepository
}

func NewBannerHandler(repo repository.BannerRepository) *BannerHandler {
	return &BannerHandler{repo}
}

// GetBanners สำหรับโชว์หน้าเว็บ (Public)
func (h *BannerHandler) GetBanners(c *fiber.Ctx) error {
	banners, err := h.repo.GetAllBanners()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Cannot fetch banners"})
	}
	return c.JSON(banners)
}

// CreateBanner สำหรับแอดมิน (Protected)
func (h *BannerHandler) CreateBanner(c *fiber.Ctx) error {
	banner := new(models.Banner)
	if err := c.BodyParser(banner); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	if err := h.repo.CreateBanner(banner); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not create banner"})
	}
	return c.JSON(banner)
}

// DeleteBanner สำหรับแอดมิน (Protected)
func (h *BannerHandler) DeleteBanner(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := h.repo.DeleteBanner(id); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Delete failed"})
	}
	return c.JSON(fiber.Map{"message": "Banner deleted"})
}
