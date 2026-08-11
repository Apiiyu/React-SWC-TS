/**
 * @description Here's a way to extend the global interfaces.
 */
declare global {
  /**
   * @description Open event payload map used by the shared mitt event bus.
   */
  interface IBusEvent {
    [key: string]: unknown;
    [key: symbol]: unknown;
  }

  /**
   * @description File entry returned by the component auto-import discovery helper.
   */
  interface IEntry {
    name: string;
    path: string;
  }
}

export {}; // This is required to ensure the file is treated as a module and avoids conflicts.
