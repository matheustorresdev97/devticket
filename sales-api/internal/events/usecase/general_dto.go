package usecase

type EventDTO struct {
	ID           string  `json:"id"`
	Name         string  `json:"name"`
	Location     string  `json:"location"`
	Organization string  `json:"organization"`
	Rating       string  `json:"rating"`
	Date         string  `json:"date"`
	ImageUrl     string  `json:"image_url"`
	Capacity     int     `json:"capacity"`
	Price        float64 `json:"price"`
	PartnerID    int     `json:"partner_id"`
}

type SpotDTO struct {
	ID       string `json:"id"`
	EventID  string `json:"event_id"`
	Name     string `json:"name"`
	Status   string `json:"status"`
	TicketID string `json:"ticket_id"`
}

type TicketDTO struct {
	ID         string  `json:"id"`
	SpotID     string  `json:"spot_id"`
	TicketType string  `json:"ticket_type"`
	Price      float64 `json:"price"`
}