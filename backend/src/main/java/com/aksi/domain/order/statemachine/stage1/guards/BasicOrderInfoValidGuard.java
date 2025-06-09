package com.aksi.domain.order.statemachine.stage1.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoEvent;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoState;
import com.aksi.domain.order.statemachine.stage1.service.BasicOrderInfoValidationService;
import com.aksi.domain.order.statemachine.stage1.validator.BasicOrderInfoValidationResult;

/**
 * Guard для перевірки валідності базової інформації замовлення.
 * Перевіряє чи пройшла базова інформація валідацію успішно.
 */
@Component
public class BasicOrderInfoValidGuard implements Guard<BasicOrderInfoState, BasicOrderInfoEvent> {

    private final BasicOrderInfoValidationService validationService;

    public BasicOrderInfoValidGuard(BasicOrderInfoValidationService validationService) {
        this.validationService = validationService;
    }

    @Override
    public boolean evaluate(StateContext<BasicOrderInfoState, BasicOrderInfoEvent> context) {
        BasicOrderInfoDTO basicOrderInfo = context.getExtendedState().get("basicOrderInfo", BasicOrderInfoDTO.class);

        if (basicOrderInfo == null) {
            return false;
        }

        BasicOrderInfoValidationResult result = validationService.validateComplete(basicOrderInfo);
        return result.isValid();
    }
}
