import { ExposeOptions, Transform } from "class-transformer";

/**
 * Expose the id of the entity 
 * @param options The options to pass to the Expose decorator
 * @returns The Expose decorator
 */
export const ExposeId = (options?: ExposeOptions) => {
  return (target: Object, propertyKey: string) => {
    Transform(({ obj }) => obj[propertyKey]?.toString())(target, propertyKey);
  };
};