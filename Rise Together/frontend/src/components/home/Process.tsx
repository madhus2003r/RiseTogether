import React from 'react';
import { Typography } from '@mui/material';

const StepsComponent = () => {
    return (
        <div style={{ backgroundColor: '#ffffff' }}>
            <div style={{ margin: '0 auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        mt={{ xs: 4, sm: 6 }}
                        mb={{ xs: 1, sm: 2 }}
                        fontWeight="bold"
                        color="black"
                        lineHeight={1}
                        sx={{
                            fontSize: {
                                xs: '2rem',
                                sm: '3rem'
                            }
                        }}
                    >
                        Pathways to Rising Together
                    </Typography>
                    <h3 style={{ fontSize: '1.875rem', lineHeight: '2.25rem', fontWeight: '800', color: '#1f2937' }}>
                        How it <span style={{ color: '#ED117F' }}>Works?</span>
                    </h3>
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '1.25rem', textAlign: 'center', width: '48%', marginBottom: '2.0rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', width: '5rem', borderRadius: '9999px', backgroundColor: '#4DA3DF', color: '#ffffff', border: '0.125rem solid #ffffff', fontSize: '1.25rem', fontWeight: '600' }}>
                                1
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <h4 style={{ fontSize: '1.125rem', lineHeight: '1.75rem', fontWeight: '600', color: '#1f2937' }}>Connect Your Wallet </h4>
                                <p style={{ marginTop: '0.5rem', fontSize: '1rem', lineHeight: '1.5rem', color: '#000000' }}>
                                    Effortlessly link your account to all major wallets for seamless transactions. Enjoy convenience and security across various platforms.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '1.25rem', textAlign: 'center', width: '48%', marginBottom: '2.0rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', width: '5rem', borderRadius: '9999px', backgroundColor: '#4DA3DF', color: '#ffffff', border: '0.125rem solid #ffffff', fontSize: '1.25rem', fontWeight: '600' }}>
                                2
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <h4 style={{ fontSize: '1.125rem', lineHeight: '1.75rem', fontWeight: '600', color: '#1f2937' }}>Create Campaign</h4>
                                <p style={{ marginTop: '0.5rem', fontSize: '1rem', lineHeight: '1.5rem', color: '#000000' }}>
                                    Utilize our platform for seamless two-stage contributions, simplifying the process for impactful projects and initiatives.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '1.25rem', textAlign: 'center', width: '48%', marginBottom: '2.0rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', width: '5rem', borderRadius: '9999px', backgroundColor: '#4DA3DF', color: '#ffffff', border: '0.125rem solid #ffffff', fontSize: '1.25rem', fontWeight: '600' }}>
                                3
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <h4 style={{ fontSize: '1.125rem', lineHeight: '1.75rem', fontWeight: '600', color: '#1f2937' }}>Admin Review</h4>
                                <p style={{ marginTop: '0.5rem', fontSize: '1rem', lineHeight: '1.5rem', color: '#000000' }}>
                                    Your description and documents undergo thorough scrutiny by our administrators, ensuring accuracy and compliance with standards.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '1.25rem', textAlign: 'center', width: '48%', marginBottom: '2.0rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', width: '5rem', borderRadius: '9999px', backgroundColor: '#4DA3DF', color: '#ffffff', border: '0.125rem solid #ffffff', fontSize: '1.25rem', fontWeight: '600' }}>
                                4
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <h4 style={{ fontSize: '1.125rem', lineHeight: '1.75rem', fontWeight: '600', color: '#1f2937' }}>Stage 1: Start</h4>
                                <p style={{ marginTop: '0.5rem', fontSize: '1rem', lineHeight: '1.5rem', color: '#000000' }}>
                                    This phase commences after Admin Review ensuring a seamless transition per administrator's confirmation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '1.25rem', textAlign: 'center', width: '48%', marginBottom: '2.0rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', width: '5rem', borderRadius: '9999px', backgroundColor: '#4DA3DF', color: '#ffffff', border: '0.125rem solid #ffffff', fontSize: '1.25rem', fontWeight: '600' }}>
                                5
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <h4 style={{ fontSize: '1.125rem', lineHeight: '1.75rem', fontWeight: '600', color: '#1f2937' }}>Automated Voting Starts</h4>
                                <p style={{ marginTop: '0.5rem', fontSize: '1rem', lineHeight: '1.5rem', color: '#000000' }}>
                                    Upon completion of Stage 1 funding, contributors gain the opportunity to participate in automated voting.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '1.25rem', textAlign: 'center', width: '48%', marginBottom: '2.0rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', width: '5rem', borderRadius: '9999px', backgroundColor: '#4DA3DF', color: '#ffffff', border: '0.125rem solid #ffffff', fontSize: '1.25rem', fontWeight: '600' }}>
                                6
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <h4 style={{ fontSize: '1.125rem', lineHeight: '1.75rem', fontWeight: '600', color: '#1f2937' }}>Stage 1: End</h4>
                                <p style={{ marginTop: '0.5rem', fontSize: '1rem', lineHeight: '1.5rem', color: '#000000' }}>
                                    Upon receiving a 50%+ vote from contributors to accept or reject, the admin is notified. If accepted, creators receive funds minus platform fees (1%), and Stage 2 begins. If rejected, funds are returned to contributors, and the campaign is paused.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '1.25rem', textAlign: 'center', width: '48%', marginBottom: '2.0rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', width: '5rem', borderRadius: '9999px', backgroundColor: '#4DA3DF', color: '#ffffff', border: '0.125rem solid #ffffff', fontSize: '1.25rem', fontWeight: '600' }}>
                                7
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <h4 style={{ fontSize: '1.125rem', lineHeight: '1.75rem', fontWeight: '600', color: '#1f2937' }}>Stage 2: Start</h4>
                                <p style={{ marginTop: '0.5rem', fontSize: '1rem', lineHeight: '1.5rem', color: '#000000' }}>
                                    Repeat all steps from Stage 1, ensuring a seamless continuation of the campaign process.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '1.25rem', textAlign: 'center', width: '48%', marginBottom: '2.0rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', width: '5rem', borderRadius: '9999px', backgroundColor: '#4DA3DF', color: '#ffffff', border: '0.125rem solid #ffffff', fontSize: '1.25rem', fontWeight: '600' }}>
                                8
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <h4 style={{ fontSize: '1.125rem', lineHeight: '1.75rem', fontWeight: '600', color: '#1f2937' }}>Campaign Complete</h4>
                                <p style={{ marginTop: '0.5rem', fontSize: '1rem', lineHeight: '1.5rem', color: '#000000' }}>
                                    Upon successful completion of all steps and achieving the set objectives, the campaign will be marked as complete.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StepsComponent;
