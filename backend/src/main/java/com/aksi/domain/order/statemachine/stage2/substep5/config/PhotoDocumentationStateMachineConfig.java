package com.aksi.domain.order.statemachine.stage2.substep5.config;

import java.util.EnumSet;

import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachine;
import org.springframework.statemachine.config.StateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineConfigurationConfigurer;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;

import com.aksi.domain.order.statemachine.stage2.substep5.actions.AddPhotoAction;
import com.aksi.domain.order.statemachine.stage2.substep5.actions.CompleteDocumentationAction;
import com.aksi.domain.order.statemachine.stage2.substep5.actions.InitializePhotoDocumentationAction;
import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationEvent;
import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationState;
import com.aksi.domain.order.statemachine.stage2.substep5.guards.CanAddPhotoGuard;
import com.aksi.domain.order.statemachine.stage2.substep5.guards.DocumentationCompleteGuard;
import com.aksi.domain.order.statemachine.stage2.substep5.guards.PhotoValidGuard;

/**
 * Spring State Machine конфігурація для підетапу 2.5: Фотодокументація.
 * Тільки Enums, Actions, Guards - без Services, DTO, Mappers.
 */
@Configuration
@EnableStateMachine(name = "photoDocumentationStateMachine")
public class PhotoDocumentationStateMachineConfig extends StateMachineConfigurerAdapter<PhotoDocumentationState, PhotoDocumentationEvent> {

    private final InitializePhotoDocumentationAction initializeAction;
    private final AddPhotoAction addPhotoAction;
    private final CompleteDocumentationAction completeAction;

    private final PhotoValidGuard photoValidGuard;
    private final DocumentationCompleteGuard documentationCompleteGuard;
    private final CanAddPhotoGuard canAddPhotoGuard;

    public PhotoDocumentationStateMachineConfig(
            InitializePhotoDocumentationAction initializeAction,
            AddPhotoAction addPhotoAction,
            CompleteDocumentationAction completeAction,
            PhotoValidGuard photoValidGuard,
            DocumentationCompleteGuard documentationCompleteGuard,
            CanAddPhotoGuard canAddPhotoGuard) {

        this.initializeAction = initializeAction;
        this.addPhotoAction = addPhotoAction;
        this.completeAction = completeAction;
        this.photoValidGuard = photoValidGuard;
        this.documentationCompleteGuard = documentationCompleteGuard;
        this.canAddPhotoGuard = canAddPhotoGuard;
    }

    @Override
    public void configure(StateMachineConfigurationConfigurer<PhotoDocumentationState, PhotoDocumentationEvent> config)
            throws Exception {
        config
            .withConfiguration()
                .autoStartup(true);
    }

    @Override
    public void configure(StateMachineStateConfigurer<PhotoDocumentationState, PhotoDocumentationEvent> states)
            throws Exception {
        states
            .withStates()
                .initial(PhotoDocumentationState.INITIAL)
                .states(EnumSet.allOf(PhotoDocumentationState.class))
                .end(PhotoDocumentationState.COMPLETED)
                .end(PhotoDocumentationState.ERROR);
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<PhotoDocumentationState, PhotoDocumentationEvent> transitions)
            throws Exception {
        transitions
            // Ініціалізація: INITIAL → UPLOADING_PHOTOS
            .withExternal()
                .source(PhotoDocumentationState.INITIAL)
                .target(PhotoDocumentationState.UPLOADING_PHOTOS)
                .event(PhotoDocumentationEvent.INITIALIZE)
                .action(initializeAction)

            // Початок завантаження: UPLOADING_PHOTOS → UPLOADING_PHOTOS (internal)
            .and()
            .withInternal()
                .source(PhotoDocumentationState.UPLOADING_PHOTOS)
                .event(PhotoDocumentationEvent.START_UPLOAD)

            // Завантаження фото: UPLOADING_PHOTOS → PROCESSING_PHOTOS
            .and()
            .withExternal()
                .source(PhotoDocumentationState.UPLOADING_PHOTOS)
                .target(PhotoDocumentationState.PROCESSING_PHOTOS)
                .event(PhotoDocumentationEvent.UPLOAD_PHOTO)
                .guard(canAddPhotoGuard)
                .action(addPhotoAction)

            // Обробка фото: PROCESSING_PHOTOS → REVIEWING_PHOTOS
            .and()
            .withExternal()
                .source(PhotoDocumentationState.PROCESSING_PHOTOS)
                .target(PhotoDocumentationState.REVIEWING_PHOTOS)
                .event(PhotoDocumentationEvent.PROCESSING_COMPLETED)
                .guard(photoValidGuard)

            // Перегляд фото: REVIEWING_PHOTOS → REVIEWING_PHOTOS (internal)
            .and()
            .withInternal()
                .source(PhotoDocumentationState.REVIEWING_PHOTOS)
                .event(PhotoDocumentationEvent.REVIEW_PHOTOS)

            // Додавання ще одного фото: REVIEWING_PHOTOS → UPLOADING_PHOTOS
            .and()
            .withExternal()
                .source(PhotoDocumentationState.REVIEWING_PHOTOS)
                .target(PhotoDocumentationState.UPLOADING_PHOTOS)
                .event(PhotoDocumentationEvent.EDIT_PHOTOS)

            // Видалення фото: REVIEWING_PHOTOS → REVIEWING_PHOTOS (internal)
            .and()
            .withInternal()
                .source(PhotoDocumentationState.REVIEWING_PHOTOS)
                .event(PhotoDocumentationEvent.DELETE_PHOTO)

            // Завершення документації: REVIEWING_PHOTOS → COMPLETED
            .and()
            .withExternal()
                .source(PhotoDocumentationState.REVIEWING_PHOTOS)
                .target(PhotoDocumentationState.COMPLETED)
                .event(PhotoDocumentationEvent.COMPLETE_DOCUMENTATION)
                .guard(documentationCompleteGuard)
                .action(completeAction)

            // Обробка помилок: Будь-який стан → ERROR
            .and()
            .withExternal()
                .source(PhotoDocumentationState.UPLOADING_PHOTOS)
                .target(PhotoDocumentationState.ERROR)
                .event(PhotoDocumentationEvent.HANDLE_ERROR)

            .and()
            .withExternal()
                .source(PhotoDocumentationState.PROCESSING_PHOTOS)
                .target(PhotoDocumentationState.ERROR)
                .event(PhotoDocumentationEvent.HANDLE_ERROR)

            .and()
            .withExternal()
                .source(PhotoDocumentationState.REVIEWING_PHOTOS)
                .target(PhotoDocumentationState.ERROR)
                .event(PhotoDocumentationEvent.HANDLE_ERROR)

            // Скидання після помилки: ERROR → INITIAL
            .and()
            .withExternal()
                .source(PhotoDocumentationState.ERROR)
                .target(PhotoDocumentationState.INITIAL)
                .event(PhotoDocumentationEvent.RESET_AFTER_ERROR);
    }
}
