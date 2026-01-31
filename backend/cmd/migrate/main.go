package main

import (
	"log"
	"os"
	"path/filepath"
	"sort"

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

	files, err := filepath.Glob("migrations/*.sql")
	if err != nil {
		log.Fatalf("Failed to read migrations directory: %v", err)
	}

	sort.Strings(files)

	for _, migrationFile := range files {
		log.Printf("Running migration: %s", filepath.Base(migrationFile))
		migrationSQL, err := os.ReadFile(migrationFile)
		if err != nil {
			log.Fatalf("Failed to read migration %s: %v", migrationFile, err)
		}

		if _, err := db.Exec(string(migrationSQL)); err != nil {
			log.Fatalf("Migration %s failed: %v", migrationFile, err)
		}
	}

	log.Println("All migrations completed")
}
