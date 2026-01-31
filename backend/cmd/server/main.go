package main

import (
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"

	"github.com/davidalecrim/red-airlines/internal/database"
	"github.com/davidalecrim/red-airlines/internal/graph/dataloader"
	"github.com/davidalecrim/red-airlines/internal/graph/generated"
	"github.com/davidalecrim/red-airlines/internal/graph/resolver"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	db, err := database.ConnectSQLX()
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := db.Close(); err != nil {
			log.Printf("Failed to close database: %v", err)
		}
	}()

	loaders := dataloader.NewLoaders(db)

	srv := handler.NewDefaultServer(
		generated.NewExecutableSchema(
			generated.Config{
				Resolvers: &resolver.Resolver{DB: db, Loaders: loaders},
			}))

	http.Handle("/query", corsMiddleware(dataloader.Middleware(loaders, srv)))

	log.Println("Server: http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
