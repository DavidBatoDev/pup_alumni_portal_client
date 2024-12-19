import React, { useRef, useEffect, useState } from 'react';
import api from "../../api.js";
import './EventsSection.css';
import CircularLoader from '../CircularLoader/CircularLoader.jsx';

const EventsSection = () => {
  const eventRef = useRef([]); // Track each event card element
  const [loading, setLoading] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch events dynamically
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/events");

        // Sort events by proximity to today's date
        const today = new Date();
        const sortedEvents = response.data.events.sort((a, b) => {
          const dateA = new Date(a.event_date);
          const dateB = new Date(b.event_date);

          // Calculate absolute difference from today
          const diffA = Math.abs(dateA - today);
          const diffB = Math.abs(dateB - today);

          return diffA - diffB; // Sort by closest date
        });

        // Slice the first 4 events after sorting
        const limitedEvents = sortedEvents.slice(0, 4);

        setEventsData(limitedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.response?.data?.message || "Failed to fetch events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Apply animations for events appearing on the screen
  useEffect(() => {
    const observerOptions = {
      threshold: 0.001,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fadeInUp');
        } else {
          entry.target.classList.remove('fadeInUp');
        }
      });
    }, observerOptions);

    eventRef.current.forEach((event) => {
      if (event) observer.observe(event);
    });

    return () => observer.disconnect();
  }, []);

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' }); // e.g., "Dec"
    const day = date.getDate(); // e.g., 11
    const year = date.getFullYear(); // e.g., 2024

    return { month, day, year };
  };

  return (
    <div className="events-section glass-more">
      <div className="container">
        <h2 className="section-title">EVENTS</h2>
        <div className="row">
          {loading ? (
            <div className='d-flex justify-content-center w-100 py-5'>
              <CircularLoader className="mx-auto" noOverlay={true} positionRelative={true} />
            </div>
          ) : (
            eventsData.length > 0 ? (
              eventsData.map((event, index) => {
                const { month, day, year } = formatEventDate(event?.event_date);
  
                return (
                  <div
                    key={event.event_id}
                    className="event-card-wrapper"
                  >
                    <div
                      className="event-card animated"
                      ref={(el) => (eventRef.current[index] = el)}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className='event-image-container'>
                        <div className='event-cover'></div>
                        <img
                          src={event?.photos[0]?.photo_path}
                          alt={event?.event_name.substring(0, 5) || 'Event Image'}
                          className="event-image" />
                      </div>
  
                      <div className="event-date">
                        <div className='d-flex flex-column'>
                          <p className='fs-6'>{month.toUpperCase()}</p> 
                          <p className='fs-3'>{day}</p>
                          <p className='fs-6'>{year}</p> 
                        </div> 
                      </div>
  
                      <div className="event-info">
                        <p className="event-title">{event?.event_name}</p>
                        <p 
                          className="event-description"
                          dangerouslySetInnerHTML={{ __html: event?.description.length > 70 ? `${event.description.substring(0,70)}...` : event.description }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-events d-flex justify-content-center align-items-center w-100 py-5">
                <p>Look forward to our future events!</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );  
};

export default EventsSection;
