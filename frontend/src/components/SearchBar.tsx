import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import styled from 'styled-components';

const SearchContainer = styled.div`
    max-width: 600px;
    margin: 0 auto 2rem;
    position: relative;
`;

const StyledInputGroup = styled.div`
    .p-inputgroup {
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border-radius: 16px;
        overflow: hidden;
        background: white;
        border: 2px solid transparent;
        transition: all 0.3s ease;

        &:hover {
            border-color: #48bb78;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        &:focus-within {
            border-color: #38a169;
            box-shadow: 0 12px 40px rgba(72, 187, 120, 0.2);
        }
    }

    .p-inputtext {
        border: none;
        padding: 1rem 1.5rem;
        font-size: 1.1rem;
        background: transparent;
        flex: 1;

        &:focus {
            box-shadow: none;
        }

        &::placeholder {
            color: #a0aec0;
            font-style: italic;
        }
    }

    .p-button {
        background: linear-gradient(135deg, #48bb78, #38a169);
        border: none;
        padding: 1rem 1.5rem;
        border-radius: 0 12px 12px 0;
        transition: all 0.3s ease;

        &:hover {
            background: linear-gradient(135deg, #38a169, #2f855a);
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
        }

        &:active {
            transform: scale(0.95);
        }

        .p-button-icon {
            font-size: 1.2rem;
        }
    }
`;

interface Props {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
}

export default function SearchBar({value, onChange, onSearch}: Props) {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <SearchContainer>
            <StyledInputGroup>
                <div className="p-inputgroup">
                    <InputText
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Discover eco-friendly destinations..."
                    />
                    <Button
                        icon="pi pi-search"
                        onClick={onSearch}
                        tooltip="Search for sustainable destinations"
                        tooltipOptions={{position: 'top'}}
                    />
                </div>
            </StyledInputGroup>
        </SearchContainer>
    );
}
