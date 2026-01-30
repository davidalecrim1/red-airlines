package database

import (
	"database/sql"
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func getConnStr() string {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		panic("DATABASE_URL environment variable is not set")
	}
	return connStr
}

// ConnectSQL returns standard sql.DB for migrations
func ConnectSQL() (*sql.DB, error) {
	db, err := sql.Open("postgres", getConnStr())
	if err != nil {
		return nil, err
	}
	return db, db.Ping()
}

// ConnectSQLX returns sqlx.DB for queries with struct scanning
func ConnectSQLX() (*sqlx.DB, error) {
	db, err := sqlx.Connect("postgres", getConnStr())
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	return db, nil
}
