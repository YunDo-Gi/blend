'use client';

import styled from 'styled-components';

const MorphShape = styled.div`
  width: 30px;
  height: 30px;
  background: var(--color-foreground);
  position: relative;
  transition:
    transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55),
    border-radius 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55),
    background-color var(--animation-duration-toggle-theme) var(--easing-toggle-theme);
  border-radius: 0;

  &::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background: var(--color-background);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    transition:
      transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55),
      border-radius 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55),
      width 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55),
      height 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55),
      background-color var(--animation-duration-toggle-theme) var(--easing-toggle-theme);
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  cursor: pointer;
  padding: 12px;

  &:hover ${MorphShape} {
    border-radius: 50%;
    transform: rotate(360deg) scale(1.1);

    &::before {
      width: 6px;
      height: 6px;
      border-radius: 0;
      transform: translate(-50%, -50%) rotate(45deg);
    }
  }
`;

export default function Logo() {
  return (
    <LogoContainer className="logo-morph">
      <MorphShape></MorphShape>
    </LogoContainer>
  );
}
