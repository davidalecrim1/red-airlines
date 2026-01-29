package resolver

import (
	"github.com/jmoiron/sqlx"

	"github.com/davidalecrim/red-airlines/internal/graph/dataloader"
)

type Resolver struct {
	DB      *sqlx.DB
	Loaders *dataloader.Loaders
}
