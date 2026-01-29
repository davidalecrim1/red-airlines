package dataloader

import (
	"context"
	"net/http"
)

type loadersKey struct{}

func Middleware(loaders *Loaders, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), loadersKey{}, loaders)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func FromContext(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey{}).(*Loaders)
}
