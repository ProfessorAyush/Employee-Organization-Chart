import React, { useState, useEffect } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { updateEmployeeManager } from '../services/api';

const StyledNode = styled.div`
  padding: 16px;
  border-radius: 8px;
  display: inline-block;
  border: 2px solid ${props => 
    props.isDragging ? '#3b82f6' : 
    props.isRecentlyMoved ? '#10b981' :
    props.isHighlighted ? '#8b5cf6' : 
    '#e5e7eb'};
  background-color: ${props => 
    props.isOver ? '#dbeafe' : 
    props.isRecentlyMoved ? '#d1fae5' :
    props.isHighlighted ? '#f3e8ff' :
    props.isDimmed ? '#f9fafb' :
    'white'};
  box-shadow: ${props => 
    props.isRecentlyMoved ? '0 4px 12px rgba(16, 185, 129, 0.4)' :
    props.isHighlighted ? '0 4px 12px rgba(139, 92, 246, 0.3)' :
    '0 2px 4px rgba(0,0,0,0.1)'};
  cursor: move;
  min-width: 220px;
  transition: all 0.3s ease;
  opacity: ${props => props.isDimmed ? '0.5' : '1'};
  user-select: none;
  animation: ${props => props.isRecentlyMoved ? 'pulse 0.5s ease-in-out' : 'none'};

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  &:hover {
    border-color: ${props => props.isHighlighted ? '#8b5cf6' : '#3b82f6'};
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  .employee-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .employee-avatar-chart {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${props => props.isHighlighted ? '#8b5cf6' : '#e5e7eb'};
    flex-shrink: 0;
  }

  .employee-main-info {
    flex: 1;
    min-width: 0;
  }

  .employee-name {
    font-weight: 600;
    font-size: 14px;
    color: #1f2937;
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .employee-id {
    font-size: 11px;
    color: #9ca3af;
    font-weight: 500;
  }

  .employee-designation {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 6px;
  }

  .employee-team {
    font-size: 11px;
    color: ${props => props.isHighlighted ? '#8b5cf6' : '#9ca3af'};
    background: ${props => props.isHighlighted ? '#ede9fe' : '#f3f4f6'};
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
    font-weight: ${props => props.isHighlighted ? '600' : 'normal'};
  }
`;

const OrgChart = ({ employees, selectedTeam, onEmployeeUpdate }) => {
  const [draggedEmployee, setDraggedEmployee] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [recentlyMoved, setRecentlyMoved] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    setResetTrigger(prev => prev + 1);
  }, [selectedTeam]);

  const handleDragStart = (e, employee) => {
    e.stopPropagation();
    setDraggedEmployee(employee);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', employee.id);
    
    if (e.dataTransfer.setDragImage) {
      const dragImage = e.currentTarget.cloneNode(true);
      dragImage.style.opacity = '0.7';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };

  const handleDragOver = (e, employee) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedEmployee && employee.id !== draggedEmployee.id) {
      setDropTarget(employee.id);
    }
  };

  const handleDragLeave = (e) => {
    e.stopPropagation();
    setDropTarget(null);
  };

  const handleDrop = async (e, newManager) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedEmployee || draggedEmployee.id === newManager.id) {
      setDraggedEmployee(null);
      setDropTarget(null);
      return;
    }

    if (isSubordinate(newManager.id, draggedEmployee.id, employees)) {
      toast.error('Cannot create circular reporting structure!', {
        icon: '⚠️',
        style: { border: '1px solid #f59e0b' },
      });
      setDraggedEmployee(null);
      setDropTarget(null);
      return;
    }

    const movedEmployee = draggedEmployee.name;
    const newManagerName = newManager.name;
    const toastId = toast.loading(`Moving ${movedEmployee}...`);

    console.log(`🔄 Moving ${movedEmployee} (ID: ${draggedEmployee.id}) under ${newManagerName} (ID: ${newManager.id})`);

    setRecentlyMoved(draggedEmployee.id);
    setTimeout(() => setRecentlyMoved(null), 2000);

    onEmployeeUpdate(draggedEmployee.id, newManager.id);
    setDraggedEmployee(null);
    setDropTarget(null);

    try {
      await updateEmployeeManager(draggedEmployee.id, newManager.id);
      
      toast.success(
        <div>
          <strong>{movedEmployee}</strong> now reports to <strong>{newManagerName}</strong>
        </div>,
        { id: toastId, duration: 3000 }
      );
      
      console.log(`✅ API call successful: Updated ${movedEmployee}'s manager`);
    } catch (error) {
      console.error('❌ API call failed:', error);
      
      toast.error(
        <div>
          <strong>Failed to update employee</strong>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>
            Please refresh the page to see current data
          </div>
        </div>,
        { id: toastId, duration: 5000 }
      );
      
      onEmployeeUpdate();
    }
  };

  const handleDragEnd = (e) => {
    e.stopPropagation();
    setDraggedEmployee(null);
    setDropTarget(null);
  };

  const isSubordinate = (employeeId, managerId, allEmployees) => {
    let currentId = employeeId;
    
    while (currentId !== null) {
      const current = allEmployees.find(e => e.id === currentId);
      if (!current) break;
      if (current.managerId === managerId) return true;
      currentId = current.managerId;
    }
    
    return false;
  };

  const renderTree = (employee) => {
    const children = employees.filter(e => e.managerId === employee.id);
    const isHighlighted = selectedTeam && employee.team === selectedTeam;
    const isDimmed = selectedTeam && employee.team !== selectedTeam;
    const isRecentlyMoved = recentlyMoved === employee.id;

    return (
      <TreeNode
        key={employee.id}
        label={
          <StyledNode
            className="employee-node"
            draggable
            onDragStart={(e) => handleDragStart(e, employee)}
            onDragOver={(e) => handleDragOver(e, employee)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, employee)}
            onDragEnd={handleDragEnd}
            isDragging={draggedEmployee?.id === employee.id}
            isOver={dropTarget === employee.id}
            isHighlighted={isHighlighted}
            isDimmed={isDimmed}
            isRecentlyMoved={isRecentlyMoved}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div className="employee-card-header">
              <img 
                src={employee.avatar} 
                alt={employee.name}
                className="employee-avatar-chart"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=667eea&color=fff&size=48`;
                }}
              />
              <div className="employee-main-info">
                <div className="employee-name">{employee.name}</div>
                <div className="employee-id">ID: {employee.id}</div>
              </div>
            </div>
            <div className="employee-designation">{employee.designation}</div>
            <div className="employee-team">{employee.team}</div>
          </StyledNode>
        }
      >
        {children.map(child => renderTree(child))}
      </TreeNode>
    );
  };

  const rootEmployees = employees.filter(e => e.managerId === null);

  if (rootEmployees.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
        No employees to display
      </div>
    );
  }

  return (
    <div className="chart-wrapper" style={{ width: '100%', height: '100%' }}>
      <TransformWrapper
        key={resetTrigger}
        initialScale={1}
        minScale={0.3}
        maxScale={3}
        centerOnInit={true}
        limitToBounds={false}
        panning={{
          disabled: !!draggedEmployee,
          velocityDisabled: false,
          excluded: ['employee-node'],
        }}
        wheel={{
          step: 0.1,
          disabled: !!draggedEmployee,
        }}
        doubleClick={{
          disabled: false,
          mode: 'reset',
        }}
      >
        {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
          <>
            <div className="chart-controls">
              <button 
                className="chart-control-btn" 
                onClick={() => zoomIn()}
                title="Zoom In"
              >
                +
              </button>
              
              <button 
                className="chart-control-btn" 
                onClick={() => resetTransform()}
                title="Reset View"
              >
                ⊙
              </button>
              
              <button 
                className="chart-control-btn" 
                onClick={() => zoomOut()}
                title="Zoom Out"
              >
                −
              </button>

              <div style={{ 
                borderLeft: '1px solid #e5e7eb', 
                paddingLeft: '8px',
                marginLeft: '8px',
                display: 'flex',
                gap: '4px'
              }}>
                <button 
                  className="chart-control-btn"
                  onClick={() => setTransform(0, 0, 0.5)}
                  title="50% Zoom"
                  style={{ fontSize: '10px', width: '32px' }}
                >
                  50%
                </button>
                <button 
                  className="chart-control-btn"
                  onClick={() => setTransform(0, 0, 0.75)}
                  title="75% Zoom"
                  style={{ fontSize: '10px', width: '32px' }}
                >
                  75%
                </button>
                <button 
                  className="chart-control-btn"
                  onClick={() => setTransform(0, 0, 1.5)}
                  title="150% Zoom"
                  style={{ fontSize: '10px', width: '32px' }}
                >
                  150%
                </button>
              </div>

              {selectedTeam && (
                <div style={{
                  marginLeft: '12px',
                  paddingLeft: '12px',
                  borderLeft: '1px solid #e5e7eb',
                  fontSize: '12px',
                  color: '#8b5cf6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '600'
                }}>
                  <span>🎯</span>
                  <span>Filtered: {selectedTeam}</span>
                </div>
              )}

              <div style={{
                marginLeft: '12px',
                paddingLeft: '12px',
                borderLeft: '1px solid #e5e7eb',
                fontSize: '11px',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🖱️ Scroll to Zoom</span>
                <span>✋ Drag Canvas to Pan</span>
                <span>↔️ Drag Cards to Reassign</span>
              </div>
            </div>

            <TransformComponent
              wrapperStyle={{
                width: '100%',
                height: '100%',
                cursor: draggedEmployee ? 'grabbing' : 'grab',
              }}
              contentStyle={{
                width: '100%',
                height: '100%',
              }}
            >
              <div 
                className="org-chart-container" 
                style={{ 
                  padding: '40px',
                  pointerEvents: 'auto'
                }}
              >
                <Tree
                  lineWidth={'2px'}
                  lineColor={'#cbd5e1'}
                  lineBorderRadius={'10px'}
                  label={
                    <div style={{ 
                      padding: '10px', 
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: '#1f2937'
                    }}>
                      Organization Chart
                      {selectedTeam && (
                        <span style={{
                          marginLeft: '12px',
                          fontSize: '14px',
                          color: '#8b5cf6',
                          fontWeight: 'normal'
                        }}>
                          (Showing {selectedTeam} team)
                        </span>
                      )}
                    </div>
                  }
                >
                  {rootEmployees.map(root => renderTree(root))}
                </Tree>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default OrgChart;