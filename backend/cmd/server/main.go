package main

import (
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"

	"github.com/davidalecrim/red-airlines/internal/database"
	"github.com/davidalecrim/red-airlines/internal/graph/dataloader"
	"github.com/davidalecrim/red-airlines/internal/graph/generated"
	"github.com/davidalecrim/red-airlines/internal/graph/resolver"
)

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

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{
		Resolvers: &resolver.Resolver{DB: db, Loaders: loaders},
	}))

	http.Handle("/query", dataloader.Middleware(loaders, srv))
	http.Handle("/", playground.Handler("GraphQL", "/query"))

	log.Println("Server: http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
