#!/bin/bash

cd backend
./mvnw clean install -Dcheckstyle.skip=true -Dpmd.skip=true -Dspotbugs.skip=true
./mvnw spring-boot:run 