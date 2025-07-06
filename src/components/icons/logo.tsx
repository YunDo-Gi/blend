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

const MorphText = styled.div`
  font-size: 24px;
  font-weight: 200;
  color: transparent;
  font-family: Georgia, serif;
  font-style: italic;
  pointer-events: none;
`;

const Letter = styled.span`
  display: inline-block;
  opacity: 0;
  transform: translateX(-10px) translateY(10px) scale(0.5);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  &:nth-child(1) {
    transition-delay: 0.4s;
  }

  &:nth-child(2) {
    transition-delay: 0.3s;
  }

  &:nth-child(3) {
    transition-delay: 0.2s;
  }

  &:nth-child(4) {
    transition-delay: 0.1s;
  }

  &:nth-child(5) {
    transition-delay: 0s;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  cursor: pointer;

  &:hover ${MorphShape} {
    border-radius: 50%;
    transform: rotate(360deg) scale(1.1);

    &::before {
      width: 8px;
      height: 8px;
      border-radius: 0;
      transform: translate(-50%, -50%) rotate(45deg);
    }
  }

  &:hover .letter:nth-child(1) {
    opacity: 1;
    transform: translateX(0) translateY(0) scale(1);
    color: var(--color-foreground);
    transition-delay: 0.2s;
  }

  &:hover .letter:nth-child(2) {
    opacity: 1;
    transform: translateX(0) translateY(0) scale(1);
    color: var(--color-foreground);
    transition-delay: 0.3s;
  }

  &:hover .letter:nth-child(3) {
    opacity: 1;
    transform: translateX(0) translateY(0) scale(1);
    color: var(--color-foreground);
    transition-delay: 0.4s;
  }

  &:hover .letter:nth-child(4) {
    opacity: 1;
    transform: translateX(0) translateY(0) scale(1);
    color: var(--color-foreground);
    transition-delay: 0.5s;
  }

  &:hover .letter:nth-child(5) {
    opacity: 1;
    transform: translateX(0) translateY(0) scale(1);
    color: var(--color-foreground);
    transition-delay: 0.6s;
  }
`;

export default function Logo() {
  return (
    <LogoContainer className="logo-morph">
      <MorphShape></MorphShape>
      <MorphText>
        <Letter className="letter">B</Letter>
        <Letter className="letter">l</Letter>
        <Letter className="letter">e</Letter>
        <Letter className="letter">n</Letter>
        <Letter className="letter">d</Letter>
      </MorphText>
    </LogoContainer>
  );
}
