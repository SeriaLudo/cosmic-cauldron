import { useEffect } from "react";

interface UseDatasetInViewObserverOptions {
  /**
   * Element that defines the scroll viewport. Usually the scroll container.
   * If null, the hook does nothing.
   */
  root: HTMLElement | null;
  /** CSS selector for items inside `root` to observe. */
  targetSelector: string;
  /** Root margin passed to IntersectionObserver. */
  rootMargin?: string;
  /** Threshold passed to IntersectionObserver. */
  threshold?: number | number[];
  /**
   * Data attribute name to write, without the `data-` prefix.
   * Example: "inview" => writes `data-inview="1|0"`.
   */
  datasetKey: string;
  /**
   * Value to use when the element is in view.
   * Defaults to "1".
   */
  inValue?: string;
  /**
   * Value to use when the element is out of view.
   * Defaults to "0".
   */
  outValue?: string;
  /**
   * When false, the hook immediately marks everything as in-view and disconnects.
   * Use this to tie observation to a feature flag (e.g. temperature effects active).
   */
  enabled?: boolean;
  /**
   * Extra dependencies that should re-run the observer setup
   * (e.g. the number of items rendered).
   */
  deps?: readonly unknown[];
}

export function useDatasetInViewObserver({
  root,
  targetSelector,
  rootMargin = "0px",
  threshold = 0,
  datasetKey,
  inValue = "1",
  outValue = "0",
  enabled = true,
  deps = [],
}: UseDatasetInViewObserverOptions) {
  useEffect(() => {
    if (!enabled) return;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(targetSelector));
    if (targets.length === 0) return;

    // Safe default: if IO isn't supported, keep everything "in view".
    for (const el of targets) el.dataset[datasetKey] = inValue;

    if (!("IntersectionObserver" in globalThis)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          el.dataset[datasetKey] = entry.isIntersecting ? inValue : outValue;
        }
      },
      { root, rootMargin, threshold }
    );

    for (const el of targets) io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, root, targetSelector, rootMargin, datasetKey, inValue, outValue, threshold, ...deps]);
}

