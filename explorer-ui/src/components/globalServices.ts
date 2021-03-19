import { MessageBusService } from "./bus/message-bus";


// define the child properties and their types.
type globalAppServices = {
    eventBus: MessageBusService;
};

// define our parent property accessible via globalThis.
var services: globalAppServices;

// set the values.
globalThis.services = {
    eventBus: new MessageBusService()
};

// Freeze so these can only be defined in this file.
Object.freeze(globalThis.services);


export default globalThis.services
