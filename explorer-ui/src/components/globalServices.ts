import {MessageBusService} from "../bus/message-bus"

// define the child properties and their types.
type GlobalAppServices = {
    eventBus: MessageBusService;
    state: {
        activeTabId: string
    }
}

// define our parent property accessible via globalThis. Also apply the TypeScript type.
var services: GlobalAppServices;

// define our parent property accessible via globalThis.
// Should migrate this ot use React Hooks with context for state management
globalThis.services = {
    eventBus: new MessageBusService(),
    state: {
        activeTabId: "000-000-000-000"
    }
}


// Freeze so these can only be defined in this file.
Object.freeze(globalThis.services);
export default globalThis.services
