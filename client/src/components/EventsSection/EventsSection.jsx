// src/components/EventsSection/EventsSection.jsx
import React, { useRef, useEffect, useState } from 'react';
import api from "../../api.js";
import './EventsSection.css';
import { Link } from 'react-router-dom';
import CircularLoader from '../CircularLoader/CircularLoader.jsx';

import eventImage1 from '../../assets/images/eventimage1.png';
import eventImage2 from '../../assets/images/eventimage2.jpg';
import eventImage3 from '../../assets/images/eventimage3.jpg';
import eventImage4 from '../../assets/images/eventimage4.jpg';

// Sample event data
const dummyEvents = [
  {
    event_id: 1,
    photos: [{photo_path: eventImage1}],
    event_date: '24-12-18',
    event_name: 'Register for the PUP Alumni Leadership Conference',
  },
  {
    event_id: 2,
    photos: [{photo_path: eventImage2}],
    event_date: '24-12-18',
    event_name: 'Register for the PUP Alumni Leadership Conference',
  },
  {
    event_id: 3,
    photos: [{photo_path: eventImage3}],
    event_date: '24-12-18',
    event_name: 'Register for the PUP Alumni Leadership Conference',
  },
  {
    event_id: 4,
    photos: [{photo_path: eventImage4}],
    event_date: '24-12-18',
    event_name: 'Register for the PUP Alumni Leadership Conference',
  },
];

const EventsSection = () => {
  const eventRef = useRef([]); // Track each event card element
  const [loading, setLoading] = useState(false);
  const [eventsData, setEventsData] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/events");
        setEventsData(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.response?.data?.message || "Failed to fetch events. Please try again later."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.001, // Trigger animation when 20% of the card is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fadeInUp'); // Apply the animation class
        } else {
          entry.target.classList.remove('fadeInUp'); // Remove the animation class when out of view
        }
      });
    }, observerOptions);

    eventRef.current.forEach((event) => {
      if (event) observer.observe(event);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="events-section glass-more">
      <div className="container">
        <h2 className="section-title">EVENTS</h2>
        <div className="row">
          {loading
            ? <div className='d-flex justify-content-center w-100 py-5'>
              <CircularLoader className="mx-auto" noOverlay={true} positionRelative={true} />
            </div>
            : eventsData.map((event, index) => (
              <div
                key={event.event_id}
                className="event-card-wrapper col-lg-3 col-md-4 col-sm-6"
              > {/* Added col-6 for mobile view */}
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
                  <div className="event-info">
                    <h3 className="event-date">Starts {new Date(event?.event_date)?.toDateString()}</h3>
                    <p className="event-title">{event?.event_name}</p>
                  </div>
                </div>
              </div>

            ))}
        </div>
      </div>
    </div>
  );
};

export default EventsSection;
