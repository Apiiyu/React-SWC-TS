// Mitt
import mitt, { type Emitter } from 'mitt';

/**
 * @description Shared typed event bus used to decouple transport errors from toast rendering.
 */
const eventBus: Emitter<IBusEvent> = mitt<IBusEvent>();

export default eventBus;
