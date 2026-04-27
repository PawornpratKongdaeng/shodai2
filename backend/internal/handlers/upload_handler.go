package handlers

import (
	"fmt"
	"os" // <-- 1. เพิ่ม os เข้ามาสำหรับจัดการไฟล์และโฟลเดอร์
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v2"
)

func UploadImage(c *fiber.Ctx) error {
	// รับไฟล์
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot read file"})
	}

	// ---------------------------------------------------------
	// 2. เพิ่มโค้ดส่วนนี้: ตรวจสอบและสร้างโฟลเดอร์ uploads อัตโนมัติ
	uploadDir := "./uploads"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		fmt.Println("Error creating directory:", err)
		return c.Status(500).JSON(fiber.Map{"error": "Cannot create upload directory"})
	}
	// ---------------------------------------------------------

	// ตั้งชื่อและบันทึก
	filename := fmt.Sprintf("%d%s", time.Now().Unix(), filepath.Ext(file.Filename))
	savePath := fmt.Sprintf("%s/%s", uploadDir, filename)

	if err := c.SaveFile(file, savePath); err != nil {
		// พิมพ์ Error ออกมาดูใน Terminal ด้วย จะได้รู้ว่าติดอะไร
		fmt.Println("Error saving file:", err)
		return c.Status(500).JSON(fiber.Map{"error": "Cannot save file"})
	}

	// ส่ง URL กลับ
	imageUrl := fmt.Sprintf("http://localhost:8080/uploads/%s", filename)
	return c.JSON(fiber.Map{"image_url": imageUrl})
}
