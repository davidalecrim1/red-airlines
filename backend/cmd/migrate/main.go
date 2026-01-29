package main

import (
	"log"
	"os"
	"path/filepath"

	"github.com/davidalecrim/red-airlines/internal/database"
)

func main() {
	db, err := database.ConnectSQL()
	if err != nil {
		log.Fatalf("Connection failed: %v", err)
	}
	defer func() {
		if err := db.Close(); err != nil {
			log.Printf("Failed to close database: %v", err)
		}
	}()

	log.Println("Connected to database")

	migrationFile := filepath.Join("migrations", "001_initial_schema.sql")
	migrationSQL, err := os.ReadFile(migrationFile)
	if err != nil {
		log.Fatalf("Failed to read migration: %v", err)
	}

	log.Println("Running migration...")
	if _, err := db.Exec(string(migrationSQL)); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	log.Println("Migration completed")
}
