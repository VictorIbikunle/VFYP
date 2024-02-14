import React, { useState } from 'react';
import Patient from './Patient';
import EmotionDetection from './EmotionDetection';
import GoalTracker from './GoalTracker';
import AppointmentScheduler from './AppointmentScheduler';
import Help from './Help';

const PatientSession = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  return (
    <div>
      <Patient onSelect={handlePatientSelect} />
      {selectedPatient && (
        <div>
          <h2>{`Selected Patient: ${selectedPatient.name}`}</h2>
          {/* Include other components that use selectedPatient's information */}
          <EmotionDetection patientId={selectedPatient._id} />
          <GoalTracker patientId={selectedPatient._id} />
          <AppointmentScheduler patientId={selectedPatient._id} />
          <Help patientId={selectedPatient._id} />
        </div>
      )}
    </div>
  );
};

export default PatientSession;
