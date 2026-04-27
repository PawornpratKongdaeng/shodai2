package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/shodaishop/shodaishop/internal/models"
	"github.com/shodaishop/shodaishop/internal/repository"
)

type CategoryHandler struct {
	repo repository.CategoryRepository
}

func NewCategoryHandler(repo repository.CategoryRepository) *CategoryHandler {
	return &CategoryHandler{repo}
}

func (h *CategoryHandler) GetCategories(c *fiber.Ctx) error {
	categories, err := h.repo.GetAllCategories()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Cannot fetch categories"})
	}
	return c.JSON(categories)
}

func (h *CategoryHandler) CreateCategory(c *fiber.Ctx) error {
	category := new(models.Category)
	if err := c.BodyParser(category); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}
	if err := h.repo.CreateCategory(category); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not create category"})
	}
	return c.JSON(category)
}

func (h *CategoryHandler) EditCategory(c *fiber.Ctx) error {
	// 1. ดึง ID จาก URL
	idParam := c.Params("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "รูปแบบ ID ไม่ถูกต้อง",
		})
	}

	// 2. แกะข้อมูลที่ส่งมาจาก Frontend
	var category models.Category
	if err := c.BodyParser(&category); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ข้อมูลไม่ถูกต้อง",
		})
	}

	// 3. ✨ ยัด ID กลับเข้าไป เพื่อบอก GORM ว่านี่คือการ UPDATE ไม่ใช่ INSERT
	category.ID = uint(id)

	// 4. บันทึกลงฐานข้อมูล
	if err := h.repo.EditCategory(&category); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "ไม่สามารถอัปเดตข้อมูลได้",
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "อัปเดตหมวดหมู่สำเร็จ",
		"data":    category,
	})
}

func (h *CategoryHandler) DeleteCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := h.repo.DeleteCategory(id); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Delete failed"})
	}
	return c.JSON(fiber.Map{"message": "Category deleted"})
}
