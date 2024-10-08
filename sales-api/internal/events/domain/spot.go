package domain

import (
	"errors"
	"github.com/google/uuid"
)

type SpotStatus string

var (
	ErrSpotNameRequired        = errors.New("spot name is required")
	ErrSpotNameMin2Length      = errors.New("spot name must be at least 2 characters long")
	ErrSpotNameStartWithLetter = errors.New("spot name must start with a capital letter")
	ErrSpotNameEndWithNumber   = errors.New("spot name must end with a number")
	ErrSpotNumberInvalid       = errors.New("invalid spot number")
	ErrSpotNotFound            = errors.New("spot not found")
	ErrSpotAlreadyReserved     = errors.New("spot already reserved")
)

const (
	SpotStatusAvailable SpotStatus = "available"
	SpotStatusSold      SpotStatus = "sold"
)
type Spot struct {
	ID       string
	EventID  string
	Name     string
	Status   SpotStatus
	TicketID string
}

func NewSpot(event *Event, name string) (*Spot, error) {
	spot := &Spot{
		ID:       uuid.New().String(),
		Name:     name,
		EventID:  event.ID,
		Status:   SpotStatusAvailable,
		TicketID: "",
	}
	if err := spot.Validate(); err != nil {
		return nil, err
	}
	return spot, nil
}
func (s *Spot) Validate() error {
	if s.Name == "" {
		return ErrSpotNameRequired
	}
	if len(s.Name) < 2 {
		return ErrSpotNameMin2Length
	}
	if s.Name[0] < 'A' || s.Name[0] > 'Z' {
		return ErrSpotNameStartWithLetter
	}
	if s.Name[1] < '0' || s.Name[1] > '9' {
		return ErrSpotNameEndWithNumber
	}
	return nil
}
func (s *Spot) Reserve(ticketID string) error {
	if s.Status == SpotStatusSold {
		return ErrSpotAlreadyReserved
	}
	s.Status = SpotStatusSold
	s.TicketID = ticketID
	return nil
}