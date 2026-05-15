import 'styled-components';
import { ThemeType } from '../contexts/ThemeContext';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
