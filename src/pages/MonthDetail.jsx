import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getChildren } from '../utils/storage'
import MonthlyQuestions from './MonthlyQuestions'

export default function MonthDetail() {
  const { month } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const year = parseInt(params.get('year') || new Date().getFullYear())
  const childId = params.get('childId')

  // Reuse MonthlyQuestions with the month from URL
  return <MonthlyQuestions />
}
