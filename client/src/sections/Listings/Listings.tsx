import React, { FunctionComponent } from 'react';

interface Props {
  title: string
}

export const Listings = ({ title }: Props) => {
  return (
    <h2>
      {title}
    </h2>
  )
}

export const Listings2: FunctionComponent<Props> = ({ title }: Props) => {
  return (
    <h2>
      {title}
    </h2>
  )
}
