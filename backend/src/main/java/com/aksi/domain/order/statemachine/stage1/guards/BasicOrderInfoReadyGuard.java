package com.aksi.domain.order.statemachine.stage1.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoEvent;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoState;
import com.aksi.domain.order.statemachine.stage1.service.BasicOrderInfoValidationService;

/**
 * Guard для перевірки готовності базової інформації замовлення.
 * Перевіряє чи готова базова інформація для переходу до наступного етапу.
 */
@Component
public class BasicOrderInfoReadyGuard implements Guard<BasicOrderInfoState, BasicOrderInfoEvent> {

    private final BasicOrderInfoValidationService validationService;

    public BasicOrderInfoReadyGuard(BasicOrderInfoValidationService validationService) {
        this.validationService = validationService;
    }

    @Override
    public boolean evaluate(StateContext<BasicOrderInfoState, BasicOrderInfoEvent> context) {
        BasicOrderInfoDTO basicOrderInfo = context.getExtendedState().get("basicOrderInfo", BasicOrderInfoDTO.class);

        if (basicOrderInfo == null) {
            return false;
        }

        return validationService.isReadyForNextStage(basicOrderInfo);
    }
}
