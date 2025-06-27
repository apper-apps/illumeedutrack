import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const FilterBar = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  campusOptions = [],
  courseOptions = [],
  agentOptions = [],
  intakeOptions = [],
  locationOptions = [],
  statusOptions = {},
  marketerOptions = []
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '');

  return (
    <div className="bg-white rounded-lg p-4 shadow-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ApperIcon name="Filter" size={20} />
          Filters
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            icon={showAdvanced ? "ChevronUp" : "ChevronDown"}
          >
            Advanced
          </Button>
          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onClearFilters}
              icon="X"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        <Select
          placeholder="All Campuses"
          options={campusOptions}
          value={filters.campus || ''}
          onChange={(e) => handleFilterChange('campus', e.target.value)}
        />
        <Select
          placeholder="All Courses"
          options={courseOptions}
          value={filters.course || ''}
          onChange={(e) => handleFilterChange('course', e.target.value)}
        />
        <Select
          placeholder="All Agents"
          options={agentOptions}
          value={filters.agent || ''}
          onChange={(e) => handleFilterChange('agent', e.target.value)}
        />
        <Select
          placeholder="All Intakes"
          options={intakeOptions}
          value={filters.intake || ''}
          onChange={(e) => handleFilterChange('intake', e.target.value)}
        />
        <Select
          placeholder="All Locations"
          options={locationOptions}
          value={filters.location || ''}
          onChange={(e) => handleFilterChange('location', e.target.value)}
        />
        <Input
          placeholder="Search students..."
          icon="Search"
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <Select
            placeholder="Offer Status"
            options={statusOptions.offer || []}
            value={filters.offerStatus || ''}
            onChange={(e) => handleFilterChange('offerStatus', e.target.value)}
          />
          <Select
            placeholder="GS Status"
            options={statusOptions.gs || []}
            value={filters.gsStatus || ''}
            onChange={(e) => handleFilterChange('gsStatus', e.target.value)}
          />
<Select
            placeholder="COE Status"
            options={statusOptions.coe || []}
            value={filters.coeStatus || ''}
            onChange={(e) => handleFilterChange('coeStatus', e.target.value)}
          />
          <Select
            placeholder="All Marketers"
            options={marketerOptions}
            value={filters.marketer || ''}
            onChange={(e) => handleFilterChange('marketer', e.target.value)}
          />
          <Select
            placeholder="Visa Status"
            options={statusOptions.visa || []}
            value={filters.visaStatus || ''}
            onChange={(e) => handleFilterChange('visaStatus', e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default FilterBar;