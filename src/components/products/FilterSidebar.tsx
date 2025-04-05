
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { X } from 'lucide-react';
import { filters, categories } from '@/data/products';

export interface FilterState {
  goldWeightRange: [number, number];
  diamondCtsRange: [number, number];
  categories: string[];
  types: string[];
  materials: string[];
  purities: string[];
  gemstones: string[];
  occasions: string[];
  genders: string[];
  tags: string[];
  sort: string;
}

const initialFilterState: FilterState = {
  goldWeightRange: [0, 50],
  diamondCtsRange: [0, 10],
  categories: [],
  types: [],
  materials: [],
  purities: [],
  gemstones: [],
  occasions: [],
  genders: [],
  tags: [],
  sort: "featured"
};

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

const FilterSidebar = ({ onFilterChange, initialFilters }: FilterSidebarProps) => {
  const [filterState, setFilterState] = useState<FilterState>({
    ...initialFilterState,
    ...initialFilters
  });
  const [goldWeightRange, setGoldWeightRange] = useState<[number, number]>(
    initialFilters?.goldWeightRange || [0, 50]
  );
  const [diamondCtsRange, setDiamondCtsRange] = useState<[number, number]>(
    initialFilters?.diamondCtsRange || [0, 10]
  );
  const [customTags, setCustomTags] = useState<string[]>([]);

  useEffect(() => {
    // Load custom tags from localStorage
    const savedTags = localStorage.getItem('savedTags');
    if (savedTags) {
      setCustomTags(JSON.parse(savedTags));
    }
  }, []);

  useEffect(() => {
    onFilterChange(filterState);
  }, [filterState, onFilterChange]);

  const handleGoldWeightChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]];
    setGoldWeightRange(range);
    setFilterState(prev => ({ ...prev, goldWeightRange: range }));
  };

  const handleDiamondCtsChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]];
    setDiamondCtsRange(range);
    setFilterState(prev => ({ ...prev, diamondCtsRange: range }));
  };

  const handleCheckboxChange = (
    filterKey: keyof Omit<FilterState, 'goldWeightRange' | 'diamondCtsRange' | 'sort'>,
    value: string
  ) => {
    setFilterState(prev => {
      const currentValues = prev[filterKey] as string[];
      return {
        ...prev,
        [filterKey]: currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      };
    });
  };

  const clearFilters = () => {
    setFilterState(initialFilterState);
    setGoldWeightRange([0, 50]);
    setDiamondCtsRange([0, 10]);
  };

  // Combine built-in tags with custom tags
  const allTags = [...['New', 'Bestseller', 'Trending', 'Wedding', 'Special Occasion', 'Gift'], ...customTags];
  
  // Remove duplicates
  const uniqueTags = [...new Set(allTags)];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Filters</h2>
        <button 
          onClick={clearFilters}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center"
        >
          <X size={14} className="mr-1" />
          Clear all
        </button>
      </div>

      <Separator />

      {/* Gold Weight Range Filter */}
      <div>
        <h3 className="text-sm font-medium mb-4 text-black">Gold Weight (grams)</h3>
        <Slider
          defaultValue={goldWeightRange}
          value={goldWeightRange}
          max={50}
          step={1}
          onValueChange={handleGoldWeightChange}
          className="mb-1"
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
          <span>{goldWeightRange[0]}g</span>
          <span>{goldWeightRange[1]}g</span>
        </div>
      </div>

      {/* Diamond Carats Range Filter */}
      <div>
        <h3 className="text-sm font-medium mb-4 text-black">Diamond Weight (carats)</h3>
        <Slider
          defaultValue={diamondCtsRange}
          value={diamondCtsRange}
          max={10}
          step={0.1}
          onValueChange={handleDiamondCtsChange}
          className="mb-1"
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
          <span>{diamondCtsRange[0]}cts</span>
          <span>{diamondCtsRange[1]}cts</span>
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <Accordion type="multiple" defaultValue={["categories"]}>
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm font-medium py-3 text-black">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.name}`}
                    checked={filterState.categories.includes(category.name)}
                    onCheckedChange={() => handleCheckboxChange('categories', category.name)}
                  />
                  <Label 
                    htmlFor={`category-${category.name}`}
                    className="text-sm flex-1 cursor-pointer"
                  >
                    {category.name}
                    <span className="ml-1 text-muted-foreground">({category.count})</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Types */}
      <Accordion type="multiple">
        <AccordionItem value="types">
          <AccordionTrigger className="text-sm font-medium py-3 text-black">Types</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {filters.types.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type}`}
                    checked={filterState.types.includes(type)}
                    onCheckedChange={() => handleCheckboxChange('types', type)}
                  />
                  <Label 
                    htmlFor={`type-${type}`}
                    className="text-sm flex-1 cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Materials */}
      <Accordion type="multiple">
        <AccordionItem value="materials">
          <AccordionTrigger className="text-sm font-medium py-3 text-black">Materials</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {filters.materials.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`material-${material}`}
                    checked={filterState.materials.includes(material)}
                    onCheckedChange={() => handleCheckboxChange('materials', material)}
                  />
                  <Label 
                    htmlFor={`material-${material}`}
                    className="text-sm flex-1 cursor-pointer"
                  >
                    {material}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Purities */}
      <Accordion type="multiple">
        <AccordionItem value="purities">
          <AccordionTrigger className="text-sm font-medium py-3 text-black">Purities</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {filters.purities.map((purity) => (
                <div key={purity} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`purity-${purity}`}
                    checked={filterState.purities.includes(purity)}
                    onCheckedChange={() => handleCheckboxChange('purities', purity)}
                  />
                  <Label 
                    htmlFor={`purity-${purity}`}
                    className="text-sm flex-1 cursor-pointer"
                  >
                    {purity}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Gemstones */}
      <Accordion type="multiple">
        <AccordionItem value="gemstones">
          <AccordionTrigger className="text-sm font-medium py-3 text-black">Gemstones</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {filters.gemstones.map((gemstone) => (
                <div key={gemstone} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`gemstone-${gemstone}`}
                    checked={filterState.gemstones.includes(gemstone)}
                    onCheckedChange={() => handleCheckboxChange('gemstones', gemstone)}
                  />
                  <Label 
                    htmlFor={`gemstone-${gemstone}`}
                    className="text-sm flex-1 cursor-pointer"
                  >
                    {gemstone}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Occasions */}
      <Accordion type="multiple">
        <AccordionItem value="occasions">
          <AccordionTrigger className="text-sm font-medium py-3 text-black">Occasions</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {filters.occasions.map((occasion) => (
                <div key={occasion} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`occasion-${occasion}`}
                    checked={filterState.occasions.includes(occasion)}
                    onCheckedChange={() => handleCheckboxChange('occasions', occasion)}
                  />
                  <Label 
                    htmlFor={`occasion-${occasion}`}
                    className="text-sm flex-1 cursor-pointer"
                  >
                    {occasion}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Gender */}
      <Accordion type="multiple">
        <AccordionItem value="genders">
          <AccordionTrigger className="text-sm font-medium py-3 text-black">Gender</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {filters.genders.map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`gender-${gender}`}
                    checked={filterState.genders.includes(gender)}
                    onCheckedChange={() => handleCheckboxChange('genders', gender)}
                  />
                  <Label 
                    htmlFor={`gender-${gender}`}
                    className="text-sm flex-1 cursor-pointer"
                  >
                    {gender}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Tags */}
      <Accordion type="multiple">
        <AccordionItem value="tags">
          <AccordionTrigger className="text-sm font-medium py-3 text-black">Tags</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {uniqueTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`tag-${tag}`}
                    checked={filterState.tags.includes(tag)}
                    onCheckedChange={() => handleCheckboxChange('tags', tag)}
                  />
                  <Label 
                    htmlFor={`tag-${tag}`}
                    className="text-sm flex-1 cursor-pointer"
                  >
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterSidebar;
