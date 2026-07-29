package com.portfolio.model;

public class SystemMetric {
    private String id;
    private String label;
    private String value;
    private String unit;
    private String trend;
    private String status;

    public SystemMetric() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getTrend() { return trend; }
    public void setTrend(String trend) { this.trend = trend; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
