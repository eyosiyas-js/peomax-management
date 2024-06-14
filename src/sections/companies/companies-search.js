import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const CompaniesSearch = ({onSearch}) => (
  <Card sx={{ p: 2,width:"400px" }}>
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search"
      onChange={onSearch}
      startAdornment={(
        <InputAdornment position="start">
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <MagnifyingGlassIcon />
          </SvgIcon>
        </InputAdornment>
      )}
      sx={{ maxWidth: 700 }}
    />
  </Card>
);
