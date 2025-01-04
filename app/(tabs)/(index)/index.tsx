import Container from '@lib/components/Container';
import Header from '@lib/components/Header';
import HomeSectionHeader from '@lib/components/HomeSectionHeader';
import GridCompactItem from '@lib/components/MediaLibraryList/GridCompactItem';
import React from 'react';

export default function Home() {
    return (
        <Container>
            <Header title="Home" withAvatar />
            <HomeSectionHeader label="Recently Played" description="Your recently played tracks" />
            <GridCompactItem
                id='dffdfgdfs'
                title='title'
                coverUri=''
            />
        </Container>
    )
}