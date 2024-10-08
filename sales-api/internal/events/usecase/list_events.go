package usecase
import "github.com/matheustorresdev97/devticket/sales-api/internal/events/domain"

type ListEventsOutputDTO struct {
	Events []EventDTO `json:"events"`
}

type ListEventsUseCase struct {
	repo domain.EventRepository
}

func NewListEventsUseCase(repo domain.EventRepository) *ListEventsUseCase {
	return &ListEventsUseCase{
		repo: repo,
	}
}

func (uc *ListEventsUseCase) Execute() (*ListEventsOutputDTO, error) {
	events, err := uc.repo.ListEvents()
	if err != nil {
		return nil, err
	}
	eventsDTO := make([]EventDTO, len(events))
	for i, event := range events {
		eventsDTO[i] = EventDTO{
			ID:           event.ID,
			Name:         event.Name,
			Location:     event.Location,
			Organization: event.Organization,
			Rating:       string(event.Rating),
			Date:         event.Date.Format("2024-06-19 12:34:56"),
			ImageUrl:     event.ImageURL,
			Capacity:     event.Capacity,
			Price:        event.Price,
			PartnerID:    event.PartnerID,
		}
	}
	return &ListEventsOutputDTO{
		Events: eventsDTO,
	}, nil
}