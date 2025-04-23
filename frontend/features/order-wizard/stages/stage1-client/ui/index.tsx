import React, { useState } from 'react';
import { Box, Paper, Typography, Divider, Button, Stepper, Step, StepLabel } from '@mui/material';
import ClientSearch from './ClientSearch';
import ClientForm from './ClientForm';
import OrderBasicForm from './OrderBasicForm';
import { ClientResponse } from '@/lib/api';
import { ClientMode, Stage1Data } from '../model/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ClientStageProps {
  onComplete: (data: Stage1Data) => void;
  onNext: () => void;
  initialData?: Partial<Stage1Data>;
}

export default function ClientStage({ onComplete, onNext, initialData = {} }: ClientStageProps) {
  // Поточний крок (етап 1.1 або 1.2)
  const [activeStep, setActiveStep] = useState<number>(0);
  
  // Всі дані етапу 1
  const [stageData, setStageData] = useState<Partial<Stage1Data>>(initialData);
  
  // Режим відображення для етапу 1.1: пошук, створення, редагування або вибраний клієнт
  const [mode, setMode] = useState<ClientMode>(stageData.client ? ClientMode.SELECTED : ClientMode.SEARCH);
  const [currentClient, setCurrentClient] = useState<ClientResponse | null>(stageData.client || null);

  // Обробник вибору клієнта з результатів пошуку
  const handleClientSelect = (client: ClientResponse) => {
    setCurrentClient(client);
    setMode(ClientMode.SELECTED);
    setStageData(prev => ({ ...prev, client }));
  };

  // Обробник переходу до форми створення клієнта
  const handleCreateNew = () => {
    setCurrentClient(null);
    setMode(ClientMode.CREATE);
  };

  // Обробник переходу до форми редагування клієнта
  const handleEdit = () => {
    setMode(ClientMode.EDIT);
  };

  // Обробник скасування створення/редагування
  const handleCancel = () => {
    if (currentClient) {
      setMode(ClientMode.SELECTED);
    } else {
      setMode(ClientMode.SEARCH);
    }
  };

  // Обробник збереження клієнта (після створення/редагування)
  const handleSave = (client: ClientResponse) => {
    setCurrentClient(client);
    setMode(ClientMode.SELECTED);
    setStageData(prev => ({ ...prev, client }));
  };
  
  // Обробник повернення до пошуку клієнта
  const handleBackToSearch = () => {
    setCurrentClient(null);
    setMode(ClientMode.SEARCH);
  };
  
  // Перехід до наступного кроку (етап 1.2)
  const handleNextStep = () => {
    setActiveStep(1);
  };
  
  // Перехід до попереднього кроку (етап 1.1)
  const handlePrevStep = () => {
    setActiveStep(0);
  };
  
  // Обробник збереження базової інформації замовлення
  const handleOrderBasicSave = (data: Partial<Stage1Data>) => {
    const completeData: Stage1Data = {
      ...stageData,
      ...data,
      client: currentClient
    };
    
    setStageData(completeData);
    onComplete(completeData);
    onNext();
  };

  // Відображення поточного етапу
  const renderStep = () => {
    if (activeStep === 0) {
      // Етап 1.1: Вибір або створення клієнта
      if (mode === ClientMode.SEARCH) {
        return (
          <ClientSearch 
            onClientSelect={handleClientSelect} 
            onCreateNew={handleCreateNew} 
          />
        );
      } else if (mode === ClientMode.CREATE || mode === ClientMode.EDIT) {
        return (
          <ClientForm 
            client={mode === ClientMode.EDIT ? currentClient : null} 
            onSave={handleSave} 
            onCancel={handleCancel} 
          />
        );
      } else if (mode === ClientMode.SELECTED && currentClient) {
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Клієнт вибраний: {currentClient.lastName} {currentClient.firstName}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToSearch}
              >
                Змінити клієнта
              </Button>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined"
                  onClick={handleEdit}
                >
                  Редагувати
                </Button>
                
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleNextStep}
                >
                  Продовжити
                </Button>
              </Box>
            </Box>
          </Box>
        );
      }
    } else if (activeStep === 1) {
      // Етап 1.2: Базова інформація замовлення
      return (
        <OrderBasicForm 
          onSave={handleOrderBasicSave}
          onBack={handlePrevStep}
          data={stageData}
        />
      );
    }
    
    return null;
  };
  
  return (
    <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
      <Typography variant="h5" gutterBottom>
        Етап 1: Вибір клієнта та базова інформація
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        <Step>
          <StepLabel>Клієнт</StepLabel>
        </Step>
        <Step>
          <StepLabel>Базова інформація</StepLabel>
        </Step>
      </Stepper>
      
      <Divider sx={{ mb: 3 }} />
      
      {renderStep()}
    </Paper>
  );
}
