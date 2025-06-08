package com.aksi.domain.order.statemachine.stage2.substep3.adapter;

import java.util.List;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.DefectSelectionDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.DefectsStainsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.StainSelectionDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.service.DefectsStainsStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine адаптер для підетапу 2.3: Забруднення, дефекти та ризики
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DefectsStainsStateMachineAdapter {

    private final DefectsStainsStepService defectsStainsStepService;

    /**
     * Отримати доступні типи плям
     */
    public List<StainSelectionDTO> getAvailableStains(StateContext<OrderState, OrderEvent> context) {
        log.debug("Отримання доступних типів плям через State Machine адаптер");
        return defectsStainsStepService.getAvailableStains();
    }

    /**
     * Отримати доступні типи дефектів
     */
    public List<DefectSelectionDTO> getAvailableDefects(StateContext<OrderState, OrderEvent> context) {
        log.debug("Отримання доступних типів дефектів через State Machine адаптер");
        return defectsStainsStepService.getAvailableDefects();
    }

    /**
     * Валідувати дані про дефекти та плями
     */
    public DefectsStainsDTO validateDefectsStains(StateContext<OrderState, OrderEvent> context, DefectsStainsDTO defectsStains) {
        log.debug("Валідація даних про дефекти та плями через State Machine адаптер");
        return defectsStainsStepService.validateDefectsStains(defectsStains);
    }
}
