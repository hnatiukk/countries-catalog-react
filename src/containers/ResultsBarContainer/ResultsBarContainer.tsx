import { ResultsBar } from '@/components/ResultsBar';
import { ResultsCount } from '@/components/ResultsCount';
import { ToggleButtonGroup } from '@/components/ToggleButtonGroup';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setSortBy,
  type SortBy,
} from '@/features/countries/countriesSlice';
import {
  selectCountriesItems,
  selectSortBy,
} from '@/features/countries/selectors';

const SORT_OPTIONS = [
  { value: 'population' as const, label: 'Population' },
  { value: 'area' as const, label: 'Area' },
];

export function ResultsBarContainer() {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector(selectSortBy);
  const count = useAppSelector(selectCountriesItems).length;

  const handleSortChange = (value: SortBy) => {
    dispatch(setSortBy(value));
  };

  return (
    <ResultsBar
      countSlot={<ResultsCount count={count} />}
      sortSlot={
        <ToggleButtonGroup
          label="Sort by"
          options={SORT_OPTIONS}
          value={sortBy}
          onChange={handleSortChange}
          variant="underline"
        />
      }
    />
  );
}
