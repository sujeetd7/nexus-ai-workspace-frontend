export interface RequestMetric {
  url: string;

  method: string;

  duration: number;

  success: boolean;
}

export function recordMetric(metric: string) {
  void metric;
}
