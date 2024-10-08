package domain

import (
	"errors"
	"github.com/google/uuid"
)

type TicketType string

const (
	TicketTypeFull TicketType = "full"
	TicketTypeHalf TicketType = "half"
)

var (
	ErrTicketPricePositive = errors.New("ticket price must be greater than zero")
	ErrTicketTypeInvalid   = errors.New("invalid ticket type")
)

type Ticket struct {
	ID         string
	EventID    string
	Spot       *Spot
	TicketType TicketType
	Price      float64
}

func NewTicket(event *Event, spot *Spot, ticketType TicketType) (*Ticket, error) {
	if IsValidTicketType(ticketType) {
		return nil, ErrTicketTypeInvalid
	}
	ticket := &Ticket{
		ID:         uuid.New().String(),
		EventID:    event.ID,
		Spot:       spot,
		TicketType: ticketType,
		Price:      event.Price,
	}
	ticket.CalculatePrice()
	if err := ticket.Validate(); err != nil {
		return nil, err
	}
	return ticket, nil
}

func IsValidTicketType(ticketType TicketType) bool {
	return ticketType == TicketTypeFull || ticketType == TicketTypeHalf
}

func (t *Ticket) CalculatePrice() {
	if t.TicketType == TicketTypeHalf {
		t.Price /= 2
	}
}

func (t *Ticket) Validate() error {
	if t.Price <= 0 {
		return ErrTicketPricePositive
	}
	return nil
}