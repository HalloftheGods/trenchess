import { createElement, lazy, type ReactNode, type ComponentType } from "react";
import type { RouteConfig } from "@/shared/types/route";

export type RouteParams = Record<string, string | number | undefined>;

/**
 * A utility class for type-safe route management.
 * Provides path generation, URL building, and RouteConfig creation.
 */
export class TypedRoute<P extends RouteParams = Record<string, never>> {
  constructor(public readonly path: string) {}

  /** Generates a URL by replacing path parameters. */
  build(params: P): string {
    let url = this.path;
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      url = url.replace(`:${key}`, String(value));
    }
    return url;
  }

  /** Alias for path for use in Route components. */
  get template(): string {
    return this.path;
  }

  /** For simple routes without parameters. */
  get url(): string {
    return this.path;
  }

  /**
   * DSL-like helper to create a RouteConfig for this path.
   */
  define(element: ReactNode, options: Omit<RouteConfig, "path" | "element"> = {}): RouteConfig {
    return {
      ...options,
      path: this.path,
      element,
    };
  }

  /**
   * Helper to create a lazy-loaded component.
   */
  component<T>(importer: () => Promise<{ default: ComponentType<T> }>): ComponentType<T> {
    return lazy(importer);
  }

  /**
   * Helper to create a lazy-loaded RouteConfig.
   * Leverages React.lazy and createElement internally.
   */
  lazy(
    importer: () => Promise<{ default: ComponentType<any> }>,
    props: any = {},
    options: Omit<RouteConfig, "path" | "element"> = {}
  ): RouteConfig {
    const LazyComponent = this.component(importer);
    return this.define(createElement(LazyComponent, props), options);
  }

  toString(): string {
    return this.path;
  }
}

/** Helper to create a route without parameters. */
export const route = (path: string) => new TypedRoute(path);

/** Helper to create a route with parameters. */
export const paramRoute = <P extends RouteParams>(path: string) =>
  new TypedRoute<P>(path);
