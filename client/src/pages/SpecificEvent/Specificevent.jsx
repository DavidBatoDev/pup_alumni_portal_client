import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar";
import BannerSmall from '../../components/Banner/BannerSmall';
import SpecificEventSidebar from '../../components/SpecificEventSidebar/SpecificEventSidebar';
import SpecificEventMainContent from '../../components/SpecificEventMainContent/SpecificEventMainContent';
import bannerImage from '../../assets/images/eventimage1.png';
import axios from 'axios';
import './Specificevent.css';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import AddEventFeedbackModal from '../../components/AddEventFeedbackModal/AddEventFeedbackModal';
import api from '../../api';

const SpecificEvent = () => {
  SwiperCore.use([Navigation]);
  const [loading, setLoading] = useState(false);
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [isRegistered, setIsRegistered] = useState(null); // Separate state for registration status
  const [eventFeedbackData, setEventFeedbackData] = useState([])

  // for sending feedback
  const [showEventFeedbackModal, setShowEventFeedbackModal] = useState(false);

  // Fetch event data only
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await api.get(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}`);
        setEventData(response.data.event); // Set the event details
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };
    fetchEventData();
  }, [eventId]);

  // Fetch registration status only
  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        const response = await api.get(`${import.meta.env.VITE_BACKEND_URL}/api/event/${eventId}/details-with-status`);
        setIsRegistered(response.data.event.is_alumni_registered); // Set the registration status
      } catch (error) {
        console.error("Error fetching registration status:", error);
      }
    };

    fetchRegistrationStatus();
  }, [eventId]);

  useEffect(() => {
    const fetchEventFeedback = async () => {
      try {
        const response = await api.get(`${import.meta.env.VITE_BACKEND_URL}/api/event/${eventId}/feedback`);
        setEventFeedbackData(response.data.feedbacks); 
      }
      catch (error) {
        console.log("Error fetching event feedback:", error);
      }
    }

    fetchEventFeedback()
  }, [eventId])

  if (!eventData || isRegistered === null) return <CircularLoader />;

  const backgroundImage = eventData?.photos[0]?.photo_path || bannerImage;

  const calculateDaysToGo = (eventDate) => {
    const currentDate = new Date();
    const eventDateObj = new Date(eventDate);
    const timeDifference = eventDateObj.getTime() - currentDate.getTime();
    const daysToGo = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (daysToGo === 0) return "Today";

    if (daysToGo < 0) return "Event has ended at " + eventDateObj.toLocaleTimeString();

    return daysToGo;
  }

  const onCreateEventFeedback = async (formData) => {
    try {

      const response = await api.post(`/api/event/${eventId}/feedback`, formData)
      console.log("Response from creating event feedback:", response);
      console.log("Response from creating event feedback:", response.data.feedback);
      if (response.status === 200) {
        setEventFeedbackData([...eventFeedbackData, response.data.feedback]);
      }

    } catch (error) {
      console.log("Error creating event feedback:", error);
    }
  };

  return (
    <div className="specific-event-page">
      <AddEventFeedbackModal 
        showModal={showEventFeedbackModal} 
        closeModal={() => setShowEventFeedbackModal(false)}
        onCreateEventFeedback={onCreateEventFeedback} 
        />

      {loading && <CircularLoader />}

      <div className="background" style={{
        backgroundImage: `url(${backgroundImage})`,
      }}>
      </div>
      <Navbar />
      <Swiper navigation style={{ height: '100%' }}>
        {eventData.photos.map((photo, index) => (
          <SwiperSlide key={index} style={{ height: '100%' }}>
            <BannerSmall
              // bannerTitle={eventData.event_name}
              bannnerContain={true}
              bannerImage={photo?.photo_path ? photo?.photo_path : backgroundImage}
              breadcrumbs={[
                { label: "Home", link: "/" },
                { label: "Events", link: "/events" },
                { label: eventData.event_name, link: `/events/${eventData.event_id}` }
              ]}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="specific-event-section glass">
        <SpecificEventSidebar
          daysToGo={calculateDaysToGo(eventData.event_date)}
          date={eventData.event_date}
          participants={eventData.registered_alumni.length}
          venue={eventData.location}
          organizers={eventData.organization}
          type={eventData.type}
        />
        <SpecificEventMainContent
          eventId={eventData.event_id}
          title={eventData.event_name}
          date={eventData.event_date}
          venue={eventData.location}
          details={eventData.description}
          is_registered={isRegistered} // Pass registration status directly
          setIsRegisteredTrue={() => setIsRegistered(true)} // Pass setter function
          is_active={eventData.is_active}
          openFeedbackModal={() => setShowEventFeedbackModal(true)}
          eventFeedbackData={eventFeedbackData}
          LoadingTrue={() => setLoading(true)}
          LoadingFalse={() => setLoading(false)}
        />
      </div>
    </div>
  );
};

export default SpecificEvent;
